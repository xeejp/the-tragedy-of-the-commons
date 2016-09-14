defmodule TheTragedyOfTheCommons do
  use XeeThemeScript
  require Logger
  alias TheTragedyOfTheCommons.Main
  alias TheTragedyOfTheCommons.Actions

  # Callbacks
  def script_type do
    :message
  end

  def install, do: nil

  def init do
    {:ok, %{data: Main.init()}}
  end

  def join(data, id) do
    wrap_result(data, Main.join(data, id))
  end

  # Host router
  def handle_received(data, %{"action" => action, "params" => params}) do
    Logger.debug("[TheTragedyOfTheCommons] #{action} #{inspect params}")
    result = case {action, params} do
      {"fetch contents", _} -> Actions.update_host_contents(data)
      _ -> {:ok, %{data: data}}
    end
    wrap_result(data, result)
  end

  # Participant router
  def handle_received(data, %{"action" => action, "params" => params}, id) do
    Logger.debug("[TheTragedyOfTheCommons] #{action} #{inspect params}")
    result = case {action, params} do
      {"fetch contents", _} -> Actions.update_participant_contents(data, id)
      {"finish description", _} -> Participant.finish_description(data, id)
      _ -> {:ok, %{data: data}}
    end
    wrap_result(data, result)
  end

  # Utilities
  def wrap_result(old, {:ok, result}) do
    {:ok, Main.compute_diff(old, result)}
  end

  def wrap_result(old, new) do
    {:ok, Main.compute_diff(old, %{data: new})}
  end
end